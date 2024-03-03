import puppeteer from "puppeteer";
import handlebars from "handlebars";
import * as fs from "fs";
import nodemailer from "nodemailer";
import { IOrder } from "../../interfaces/order/order.interface";
import * as path from 'path';
import {v4 as uuidv4} from "uuid";
import os from 'os';
import { Product } from "../../models/product.model";

// const emailReceivers = ["is1521@fayoum.edu.eg", "oa1476@fayoum.edu.eg"];
const subject = "Hello from Reuseable Store";
const logoUrl ="./logo.png";
const invoiceName = uuidv4();
export const sendEmail = async (Order:IOrder) => {
  try {
    console.log("order",Order);
    // 1) Create a PDF
    const emailTemplate = createEmailTemplate(Order);
    const outputPath = `./uploads/invoice/${invoiceName}.pdf`;
    await takePDFOfHTML(emailTemplate, outputPath);
    // 2) Send Email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: '"Reuseable Store" <eslamgalal0312@gmail.com>',
      to: Order.email,
      subject: subject,
      text: "Please find the attached PDF and HTML files.",
      html: emailTemplate,
      attachments: [
        {
          filename: "invoice.pdf",
          path: outputPath,
        },
      ],
    };
  
    console.log("Email Sent");
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};

const createEmailTemplate = (Order:IOrder) => {
  const templateSource = fs.readFileSync(path.join(__dirname, 'sendEmail.html'));
  const template = handlebars.compile(templateSource.toString());
  handlebars.registerHelper("multiply", function (a: number, b: number) {
    return a * b;
  });


  const orderItems = Order.onlineItems.items.concat(Order.cashItems.items); // Combine the items
console.log("orderItems",orderItems);
  // Create a new array with "own" properties
  const modifiedOrderItems = orderItems.map((item) => ({
      productName: item.product.title_en,
      price: item.product.finalPrice,
      quantity: item.quantity,
      total: item.quantity * item.product.finalPrice,
    })
);
 console.log("modifiedOrderItems",modifiedOrderItems);

const options = { allowProtoMethodsByDefault: true };
  return template({
    orderItems: modifiedOrderItems,
    totalPrice: Order.totalPrice,
    invoiceNumber: invoiceName,
    name:Order.name,
    address:Order.address,
    area:Order.area,
    city:Order.city,
    postalCode:Order.postalCode,
    logo:logoUrl,
  },options);
};

async function takePDFOfHTML(htmlContent:string, outputPath:string) {
  
const osPlatform = os.platform(); // possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
console.log('Scraper running on platform: ', osPlatform);
let executablePath;
if (/^win/i.test(osPlatform)) {
  executablePath = '';
} else if (/^linux/i.test(osPlatform)) {
  executablePath = process.env.CHROME_BIN;
}
  const browser = await puppeteer.launch({
    headless: "new", // Opt in to the new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional arguments
    executablePath: executablePath
  });
  console.log( typeof(browser) );
  
  if (!browser) {
    return ;
  }
  const page = await browser.newPage();
  if(!page){
    return ;
  }
  try {
    // Your existing code here
    await page.setContent(htmlContent);
    // Generate the PDF with the desired options
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
    });
  } catch (error) {
    console.error("Error capturing PDF:", error);
  } finally {
    await browser.close();
  }
}
