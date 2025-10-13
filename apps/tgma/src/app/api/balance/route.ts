import { NextRequest, NextResponse } from 'next/server';

// GET balance
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'ton'
    const address = searchParams.get('address'); // TON wallet address

    if (!type || !address) {
      return NextResponse.json({ error: 'Missing required fields: type and address' }, { status: 400 });
    }

    if (type === 'ton') {
      // Determine network based on environment
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isTestnet = isDevelopment || address.startsWith('0:') || address.includes('testnet');

      // Use different API endpoints for mainnet vs testnet
      // TODO move to .env files
      const baseUrl = isTestnet ? 'https://testnet.toncenter.com' : 'https://toncenter.com';
      const apiUrl = `${baseUrl}/api/v2/getAddressBalance?address=${address}`;

      console.log(`Fetching TON balance from: ${apiUrl} (${isTestnet ? 'testnet' : 'mainnet'})`);

      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        if (data.ok) {
          // Convert from nano TON to TON (1 TON = 1,000,000,000 nano TON)
          const balanceInTon = Number(data.result) / 1e9;

          return NextResponse.json({
            balance: balanceInTon,
            currency: 'TON',
            address: address,
            network: isTestnet ? 'testnet' : 'mainnet',
            nanoBalance: data.result // Keep the original nano TON value for reference
          });
        } else {
          console.error('TON Center API error:', data);
          return NextResponse.json({ error: 'Failed to fetch TON balance' }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: 'Failed to connect to TON Center API' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid balance type' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
