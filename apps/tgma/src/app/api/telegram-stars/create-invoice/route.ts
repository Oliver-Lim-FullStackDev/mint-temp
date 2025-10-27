import { mintApi } from '@mint/client';
import { Item } from 'src/types';
import { NextRequest, NextResponse } from 'next/server';
import { PurchaseData } from '@mint/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, itemId, username, playerId } = body;

    if (!userId || !itemId) {
      return NextResponse.json({ error: 'Missing required fields: userId and itemId' }, { status: 400 });
    }

    // 1️⃣ Get item details with current pricing
    const item = await mintApi.get(`/store/items/${itemId}/prices`) as Item;
    if (!item) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const { title, description, price } = item;
    const starsPrice = price.stars || 0;

    // 2️⃣ Get Telegram bot token
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    // 3️⃣ Create transaction payload
    const transactionId = `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const purchaseData: PurchaseData = {
      itemId,
      transactionId,
      username: username || 'unknown',
      playerId: playerId || userId,
      amount: starsPrice,
    };

    // 4️⃣ Call Telegram Bot API directly with fetch
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        payload: JSON.stringify(purchaseData),
        provider_token: '', // Empty for Telegram Stars
        currency: 'XTR',    // Telegram Stars currency code
        prices: [{ label: title, amount: starsPrice }],
        start_parameter: 'start_parameter',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { error: data.description || 'Failed to create invoice' },
        { status: 500 }
      );
    }

    // 5️⃣ Return invoice link to client
    return NextResponse.json({ invoiceLink: data.result });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
