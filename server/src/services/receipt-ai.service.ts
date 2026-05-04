import OpenAI from 'openai';
import { z } from 'zod';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const receiptItemSchema = z.object({
    description: z.string().nullable(),
    quantity: z.coerce.number().nullable(),
    unitPrice: z.coerce.number().nullable(),
    total: z.coerce.number().nullable(),
});

const receiptDraftSchema = z.object({
    merchantName: z.string().nullable(),
    receiptDate: z.string().nullable(), //ISO date preferred
    currency: z.string().nullish().transform(val => val ?? 'CAD'),
    subtotal: z.coerce.number().nullable(),
    tax: z.coerce.number().nullable(),
    total: z.coerce.number().nullable(),
    paymentMethod: z.string().nullable(),
    items: z.array(receiptItemSchema).nullish().transform(val => val ?? []),
    warnings: z.array(z.string()).nullish().transform(val => val ?? []),
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
    model: process.env.OPENAI_RECEIPT_MODEL || 'gpt-4o-mini',
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
                        'Extract receipt details into JSON. Fields: merchantName, receiptDate (ISO format), currency, subtotal, tax, total, paymentMethod, items[] (description, quantity, unitPrice, total). HIGH ACCURACY REQUIRED for the "total" amount—ensure it is the final grand total paid. Add warnings[] for unclear fields. Return JSON only.',
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