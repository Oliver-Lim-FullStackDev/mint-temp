import { mintApi } from '@mint/client';
import { Item } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { makeHttpsRequest } from '@/utils/https-request';
import { PurchaseData } from '@mint/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, itemId, username, playerId } = body;

    if (!userId || !itemId) {
      return NextResponse.json({ error: 'Missing required fields: userId and itemId' }, { status: 400 });
    }

    // Get item details with current pricing from our data store
    const item = await mintApi.get(`/store/items/${itemId}/prices`) as Item;
    if (!item) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    // Extract item details
    const { title, description, price } = item;
    const starsPrice = price.stars || 0;

    // Get the BOT_TOKEN from environment variables
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

    if (!BOT_TOKEN) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    // PRODUCTION IMPLEMENTATION:
    // In a real production app:
    // 1. Generate a unique ID for this payment request
    // const requestId = generateUniqueId();
    //
    // 2. Store it in your database with the pending status
    // await db.paymentRequests.create({
    //   requestId,
    //   userId,
    //   itemId,
    //   status: 'pending',
    //   createdAt: Date.now()
    // });
    //
    // 3. Include this ID in the invoice payload
    // const payload = JSON.stringify({ requestId });
    //
    // 4. Configure your bot's webhook to handle payment_successful updates
    // and update the database with the real telegram_payment_charge_id when payment is complete
    //
    // 5. After the WebApp.openInvoice callback indicates 'paid', query your database
    // using the requestId to get the real transaction ID for successful payments

    // Generate transaction ID and create payload with all purchase data
    const transactionId = `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const purchaseData: PurchaseData = {
      itemId,
      transactionId,
      username: username || 'unknown',
      playerId: playerId || userId,
      amount: starsPrice
    };
    const payload = JSON.stringify(purchaseData);

    // Create an actual invoice link by calling the Telegram Bot API
    const data = await makeHttpsRequest(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      title,
      description,
      payload: payload, // Include all purchase data in the payload
      provider_token: '', // Empty for Telegram Stars payments
      currency: 'XTR',    // Telegram Stars currency code
      prices: [{ label: title, amount: starsPrice }],
      start_parameter: "start_parameter" // Required for some clients
    });

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json({ error: data.description || 'Failed to create invoice' }, { status: 500 });
    }

    const invoiceLink = data.result;

    // We don't store the purchase yet - that will happen after successful payment
    // We'll return the invoice link to the frontend
    return NextResponse.json({ invoiceLink });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
