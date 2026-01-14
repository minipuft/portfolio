import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate input (Basic "Authentication" / Validation)
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate processing delay (Optimization: This would be an async queue in prod)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real app, you would send email here (e.g., via Resend/SendGrid)
    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
