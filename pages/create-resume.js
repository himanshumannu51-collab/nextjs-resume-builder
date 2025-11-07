import { useForm } from 'react-hook-form';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CreateResume() {
  const { register, watch } = useForm();
  const [preview, setPreview] = useState('');
  const data = watch();

  const updatePreview = () => {
    setPreview(`
      <div style="font-family: Arial; padding: 20px; max-width: 600px;">
        <h1 style="font-size: 24px; font-weight: bold;">${data.name || 'Your Name'}</h1>
        <p>${data.email || 'email@example.com'}</p>
        <h2 style="font-size: 18px; margin-top: 20px;">Summary</h2>
        <p>${data.summary || 'Add summary'}</p>
        <h2 style="font-size: 18px; margin-top: 20px;">Experience</h2>
        <ul style="list-style-type: disc; padding-left: 20px;">
          ${data.experience ? data.experience.split('\n').map(exp => `<li>${exp}</li>`).join('') : '<li>Add experience</li>'}
        </ul>
        <h2 style="font-size: 18px; margin-top: 20px;">Skills</h2>
        <p>${data.skills || 'Add skills'}</p>
      </div>
    `);
  };

  const exportPDF = async () => {
    const element = document.getElementById('preview-div');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, heightLeft - imgHeight, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save('resume.pdf');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Create Your Resume</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <input {...register('name')} onBlur={updatePreview} placeholder="Full Name" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <input {...register('email')} onBlur={updatePreview} placeholder="Email" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <textarea {...register('summary')} onBlur={updatePreview} placeholder="Professional Summary" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', height: '80px' }} />
          <textarea {...register('experience')} onBlur={updatePreview} placeholder="Experience (one bullet per line)" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', height: '120px' }} />
          <input {...register('skills')} onBlur={updatePreview} placeholder="Skills (comma-separated)" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
          <button onClick={exportPDF} style={{ background: '#0070f3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Download PDF</button>
        </div>
        <div id="preview-div" dangerouslySetInnerHTML={{ __html: preview || '<p style="color: #999;">Start typing to see preview</p>' }} style={{ background: 'white', padding: '20px', border: '1px solid #eee', borderRadius: '4px', minHeight: '400px' }} />
      </div>
    </div>
  );
}
