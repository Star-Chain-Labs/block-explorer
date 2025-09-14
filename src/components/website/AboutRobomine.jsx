const AboutRobomine = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <img
          src="https://via.placeholder.com/500x300"
          alt="analytics"
          className="rounded-xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Revolutionizing Digital Finance with Robomine
          </h2>
          <p className="text-gray-600 mb-6">
            Robomine is an advanced blockchain ecosystem designed to simplify
            cryptocurrency adoption. With cutting-edge security, scalability,
            and global accessibility, we empower users to transact with
            confidence.
          </p>
          <button className="bg-[#249ec7] hover:bg-[#1c7da0] text-white px-6 py-3 rounded-xl font-semibold">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutRobomine;