import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { selectedRows, message } = await request.json();
  console.log('Received message:', message, 'with selected rows:', selectedRows);
  return NextResponse.json({ success: true, message: 'These rows denote the olympic players have been playing in these countries and their overall results.' });
}