import { Request, Response } from 'express';
import { getAllItems } from './factory.controller';
import changeCurrency from '../models/changeCurrency.model';
import expressAsyncHandler from 'express-async-handler';
//import IChangeCurrency from '../interfaces/changeCurrency/changeCurrency.interface';

// @desc     Update Exchange Rate
// @route    Post/api/v1/changeCurrency
// @access   Private (Admins)
export const ExchangeRate = expressAsyncHandler(async (req: Request, res: Response) => {

      const {baseCurrency} = req.body;
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`, {
        headers: {
          'X-Api-Key': `${process.env.CURRENCY_API_KEY}`,
        },
      });
  
      const data = await response.json();
      const exchangeRates = data.rates;
      await changeCurrency.deleteMany({}).exec();
      // Save the exchange rate data to the database
      const newExchangeRate = new changeCurrency({
        baseCurrency, // Assuming base currency is USD
        rates: exchangeRates,
      });
  
      await newExchangeRate.save();
  
      res.status(200).json(
        { 
          message: 'Exchange rates saved successfully',newExchangeRate 
      });

  });

// @desc     Get Exchange Rate
// @route    Get/api/v1/changeCurrency
// @access   Public (All)
export const getExchangeRate = getAllItems(changeCurrency);

