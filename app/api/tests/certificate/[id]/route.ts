import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resultId = parseInt(params.id);
    console.log('📄 Certificate request for result ID:', resultId);

    // Verify user authentication
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      console.error('❌ No auth token');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('❌ Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('✅ User authenticated:', decoded.username);

    // Get test result
    const result = db.prepare(`
      SELECT 
        tr.*,
        u.name as user_name,
        u.username,
        t.title as test_title,
        t.description as test_description
      FROM test_results tr
      JOIN users u ON tr.user_id = u.id
      JOIN tests t ON tr.test_id = t.id
      WHERE tr.id = ?
    `).get(resultId) as any;

    if (!result) {
      console.error('❌ Result not found for ID:', resultId);
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    console.log('✅ Result found:', result.user_name, result.percentage + '%');

    // Check authorization
    if (result.user_id !== decoded.userId && decoded.role !== 'admin') {
      console.error('❌ Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if passed
    if (!result.passed) {
      console.error('❌ Certificate only for passed tests');
      return NextResponse.json({ error: 'Certificate only available for passed tests' }, { status: 400 });
    }

    console.log('✅ Generating certificate HTML...');

// Generate HTML certificate
const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Completion</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Garamond', 'Georgia', serif;
      background: #f8f9fa;
      width: 310mm;
      height: 230mm;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .certificate {
      width: 310mm;
      height: 208mm;
      background: white;
      position: relative;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    }
    
    /* Elegant border design */
    .border-outer {
      position: absolute;
      top: 15mm;
      left: 15mm;
      right: 15mm;
      bottom: 15mm;
      border: 3px solid #1e3a8a;
    }
    
    .border-inner {
      position: absolute;
      top: 20mm;
      left: 20mm;
      right: 20mm;
      bottom: 20mm;
      border: 1px solid #3b82f6;
    }
    
    /* Content */
    .content {
      position: absolute;
      top: 30mm;
      left: 30mm;
      right: 30mm;
      bottom: 30mm;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    /* Header */
    .header {
      margin-bottom: 5mm;
    }
    
    .organization {
      font-size: 18px;
      color: #1e3a8a;
      font-weight: bold;
      letter-spacing: 2px;
      margin-bottom: 2mm;
    }
    
    .certificate-title {
      font-size: 26px;
      color: #1f2937;
      font-weight: bold;
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-top: 2mm;
      margin-bottom: 2mm;
    }
    
    /* Main content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 20mm;
    }
    
    .presented-to {
      font-size: 13px;
      color: #6b7280;
      font-style: italic;
      margin-bottom: 2mm;
    }
    
    .recipient-name {
      font-size: 20px;
      color: #1e3a8a;
      font-weight: bold;
      margin: 2mm 0;
      padding-bottom: 3mm;
      border-bottom: 2px solid #1e3a8a;
      display: inline-block;
      min-width: 50%;
    }
    
    .achievement-text {
      font-size: 13px;
      color: #374151;
      line-height: 1.8;
      margin: 2mm 0;
    }
    
    .course-name {
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
      margin: 5mm 0;
    }
    
    /* Footer */
    .footer {
      margin-top: 4mm;
    }
    
    .certificate-id {
      font-size: 10px;
      color: #9ca3af;
      margin-bottom: 3mm;
      font-family: 'Courier New', monospace;
    }
    
    .date-issued {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 5mm;
    }
    
    .signatures {
      display: flex;
      justify-content: space-around;
      padding: 0 40mm;
      margin-top: 3mm;
    }
    
    .signature-block {
      text-align: center;
      min-width: 60mm;
    }
    
    .signature-line {
      border-top: 1.5px solid #1f2937;
      margin-bottom: 2mm;
      width: 60mm;
    }
    
    .signature-name {
      font-size: 11px;
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 1mm;
    }
    
    .signature-title {
      font-size: 11px;
      color: #6b7280;
    }
    
    /* Decorative seal */
    .seal {
      position: absolute;
      bottom: 20mm;
      right: 24mm;
      width: 35mm;
      height: 35mm;
      border: 3px solid #1e3a8a;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
      margin-bottom: 1mm;
    }
    
    .seal-text-top {
      font-size: 10px;
      color: #1e3a8a;
      font-weight: bold;
      margin-bottom: 2mm;
    }
    
    .seal-icon {
      font-size: 15px;
      margin: 2mm 0;
    }
    
    .seal-text-bottom {
      font-size: 9px;
      color: #1e3a8a;
      margin-top: 2mm;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    
    <div class="content">
      <!-- Header -->
      <div class="header">
        <div class="organization">SHEBA E-LEARNING PORTAL</div>
        <div class="certificate-title">Certificate of Completion</div>
      </div>
      
      <!-- Main Content -->
      <div class="main-content">
        <div class="presented-to">This certificate is proudly presented to</div>
        
        <div class="recipient-name">${result.user_name.toUpperCase()}</div>
        
        <div class="achievement-text">
          For successfully completing the comprehensive training program
        </div>
        
        <div class="course-name">${result.test_title}</div>
        
        <div class="achievement-text">
          Demonstrating proficiency in Anti-Money Laundering<br/>
          and Counter Financing of Terrorism compliance standards
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="certificate-id">Certificate ID: SHEBA-${String(result.id).padStart(6, '0')}-${new Date().getFullYear()}</div>
        
        <div class="date-issued">
          Issued on ${new Date(result.completed_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
        
        <div class="signatures">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">Rabisankar Bhattacharjee</div>
            <div class="signature-title">Chief Compliance Officer</div>
          </div>
          
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">Ilmul Haque Shajib</div>
            <div class="signature-title">CFO, Sheba Fintech Limited</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Seal -->
    <div class="seal">
      <div class="seal-text-top">CERTIFIED</div>
      <div class="seal-icon">✓</div>
      <div class="seal-text-bottom">${new Date().getFullYear()}</div>
    </div>
  </div>
</body>
</html>
`;

    console.log('✅ Certificate HTML generated, length:', certificateHTML.length);

    return new NextResponse(certificateHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="Certificate_${result.user_name.replace(/\s+/g, '_')}.html"`
      }
    });

  } catch (error: any) {
    console.error('❌ Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate: ' + error.message },
      { status: 500 }
    );
  }
}
