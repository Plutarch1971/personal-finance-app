import OpenAI from 'openai';
import { z } from 'zod';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const receiptItemSchema = z.object({
    description: z.string().nullable(),
    quantity: z.number().nullable(),
    unitPrice: z.number().nullable(),
    total: z.number().nullable(),
});

const receiptDraftSchema = z.object({
    merchantName: z.string().nullable(),
    receiptDate: z.string().nullable(), //ISO date preferred
    cy: z.string().default('CAD'),
    subtotal: z.number().nullable(),
    tax: z.number().nullable(),
    total: z.number().nullable(),
    paymentMethod: z.string().nullable(),
    items: z.array(receiptItemSchema).default([]),
    warning: z.array(z.string()).default([]),
});

export type ReceiptDraft = z.infer<typeof receiptDraftSchema>;

export async function extractReceiptFromImage(
    fileBuffer: Buffer,
    mimeType: string
) : Promise<ReceiptDraft> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is missing');
    }

const base64 = fileBuffer.toString('base64');
const dataUrl = 'data:' + mimeType + ';base64,' + base64;

const completion = await client.chat.completions.create({
    model: process.env.OPENAI_RECEIPT_MODEL || 'gpt-4.1-mini',
    response_format: { type: 'json_object'},
    messages: [
        {
            role: 'system',
            content:
                'You extract receipt data and return JSON only. Use null for missing or uncertain values.',
        },
        {
            role: 'user',
            content:[
                {
                    type: 'text',
                    text:
                        'Extract merchantName, receiptDate (ISO if possible), currency, subtotal, tax, total, paymentMethod, items[]. Each item must include description, quantity, unitPrice, total. add warnings[] for unclear fields.',
                },
                {
                    type: 'image_url',
                    image_url: {
                        url: dataUrl,
                    },
                },
            ],
        },
    ],
});
 
    const content = completion.choices[0]?.message?.content;
    if (!content) {
        throw new Error('OpenAI returned empty content');
    }
    const parsed = JSON.parse(content);
    return receiptDraftSchema.parse(parsed);

}