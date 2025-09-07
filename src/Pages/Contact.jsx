import React from 'react';
import ContactForm from '../components/ContactForm';
import schoolInfo from '../hooks/useSchoolInfo';

export default function Contact() {
  return (
    <section className="min-h-[70vh] pt-24 px-6 md:px-16 bg-gradient-to-br from-white to-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Have questions or feedback? Reach out to us using the form below or contact us directly.
            We'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600">{schoolInfo.contact.email[0]}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600">
                    {schoolInfo.contact.phone.length > 0 
                      ? schoolInfo.contact.phone.join(', ')
                      : '+91 62958 84463'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Address</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {schoolInfo.address.fullAddress}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Office Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Our Location</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7215.27171663533!2d88.341211!3d25.3075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE4JzI3LjEiTiA4OMKwMjAnNDguNiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin&z=13&ll=25.3075,88.341211&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dina Public School Location"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
