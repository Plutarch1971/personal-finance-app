const { Category } = require('../models');

(async () => {
  const categories = await Category.findAll({
    where: { name: ['Government Benefits', 'Old Age Benefit', 'Canadian Pension Plan', 'Child Benefit', 'Employment Insurance'] },
    raw: true
  });
  console.log(`Found ${categories.length} categories`);
  console.log(categories);
  process.exit(0);
})();