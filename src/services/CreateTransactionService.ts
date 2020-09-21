import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
// import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    let existingCategory = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!existingCategory) {
      existingCategory = categoriesRepository.create({ title: category });

      await categoriesRepository.save(existingCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: existingCategory?.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
