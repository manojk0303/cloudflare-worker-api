// api/emails/incoming/route.js
import { NextResponse } from 'next/server';
import LemnAPI from 'lemn-api';

// Initialize the Lemn API client
const lemn = new LemnAPI(process.env.LEMN_API_KEY || '');

// API key for authorization
const API_KEY = process.env.API_KEY ?? "damdamdamdamalaedom";

export async function POST(request) {
  console.log('Received request to /api/emails/incoming');
  
  // Authentication check
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization failed: Missing or invalid Authorization header');
    return NextResponse.json(
      { error: 'Unauthorized: Missing or invalid Authorization header' },
      { status: 401 }
    );
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  if (token !== API_KEY) {
    console.log('Authorization failed: Invalid API key');
    return NextResponse.json(
      { error: 'Unauthorized: Invalid API key' },
      { status: 401 }
    );
  }

  try {
    // Parse the incoming email data
    const emailData = await request.json();
    console.log('Received email data:', emailData);
    const { sender, recipient, subject, ebody, html ,receivedAt} = emailData;
    
    if (!sender || !recipient || !subject) {
      console.log('Validation error: Missing required fields');
      return NextResponse.json(
        { error: 'Bad Request: Missing required fields' },
        { status: 400 }
      );
    }

    // Log the received email
    console.log('Processing email:', {
      from: sender,
      to: recipient,
      subject: subject,
      timestamp: new Date().toISOString()
    });

    // Extract username from recipient (e.g., user-123@domain.com → user-123)
    const username = recipient.split('@')[0];

    // Define emailResult variable with a default value
    let emailResult = { id: 'not_sent' };
    
    // Forward the email via Lemn
    try {
      emailResult = await lemn.transactional.send({
        fromname: 'Email Forwarding System',
        fromemail: 'send@member-notification.com',
        to: 'manojkumarcpyk@gmail.com', // Your email address
        subject: `[FORWARDED] ${subject} (for ${username})`,
        body: `
          <html>
            <body>
              <h2>Forwarded Email from ${sender}</h2>
              <p><strong>Original Recipient:</strong> ${recipient}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Time Received:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Username:</strong> ${username}</p>
              
              <hr />
              <h3>Email Content:</h3>
              ${html || `<pre>${body}</pre>`}
              
              <hr />
              <p>This email was automatically forwarded by your Cloudflare Email Routing system.</p>
            </body>
          </html>
        `
      });
      console.log('Email forwarded successfully:', emailResult);
    } catch (lemnError) {
      console.error('Error sending email via Lemn:', lemnError);
      // Continue processing, don't fail the overall request
      return NextResponse.json(
        { 
          error: 'Email forwarding failed',
          message: lemnError.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email received and forwarded successfully',
      emailId: emailResult?.id || 'unknown',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Email processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: error.message || 'Failed to process incoming email',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Optionally handle GET requests for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'OK',
    message: 'Email receiving API is running'
  });
}