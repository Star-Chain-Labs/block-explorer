import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div id="contact" className="bg-gradient-to-r from-blue-950 via-blue-950 to-blue-950 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-gray-300 mb-8">
            Have questions about ROBOMINE Token or need support?  
            Fill out the form or use the contact details below and our team will get back to you.
          </p>

          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-yellow-400 text-xl" />
              <p>Street No:4, ROBOMINE Avenue</p>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-yellow-400 text-xl" />
              <p>support@robomine.com</p>
            </div>
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-yellow-400 text-xl" />
              <p>+91 98765 43210</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8">
            <iframe
              title="map"
              className="w-full h-64 rounded-lg shadow-lg border-2 border-white/20"
              src="https://maps.google.com/maps?q=delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="bg-white/10 p-8 rounded-lg shadow-lg border border-white/20">
          <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Subject"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Message</label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Write your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-md shadow-md hover:bg-yellow-300 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
