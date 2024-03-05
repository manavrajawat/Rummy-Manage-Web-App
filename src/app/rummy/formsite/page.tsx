import React from 'react';

export default function FormSite() {
  return (
    <div className="container mx-auto max-w-2xl p-4 mt-10">
      <form action="#" className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Main</h2>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="appName" className="sr-only">App Name</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Name"
            type="text"
            id="appName"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="setTitle" className="sr-only">Set Title</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Title"
            type="text"
            id="setTitle"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="siteLink" className="sr-only">Site Link</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Link"
            type="text"
            id="siteLink"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="appDescription" className="sr-only">Site Description</label>
          <textarea
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Description"
            id="appDescription"
          ></textarea>
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="appKeywords" className="sr-only">Site Keywords</label>
          <textarea
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Keywords"
            id="appKeywords"
          ></textarea>
        </div>

        <hr className="my-4" />
        <h2 className="text-2xl font-bold mb-4">Images</h2>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="image1" className="sr-only">Image 1</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            type="file"
            id="image1"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="image2" className="sr-only">Image 2</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            type="file"
            id="image2"
          />
        </div>

        <hr className="my-4" />
        <h2 className="text-2xl font-bold mb-4">Social-Media</h2>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="other1Title" className="sr-only">Other 1 Title</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Other 1 Title"
            type="text"
            id="other1Title"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="other2Title" className="sr-only">Other 2 Title</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Other 2 Title"
            type="text"
            id="other2Title"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="other3Title" className="sr-only">Other 3 Title</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Other 3 Title"
            type="text"
            id="other3Title"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="other4Title" className="sr-only">Other 4 Title</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Other 4 Title"
            type="text"
            id="other4Title"
          />
        </div>

        <div className='border rounded-lg border-gray-400'>
          <label htmlFor="other5Title" className="sr-only">Other 5 Title</label>
          <input
            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:outline-none focus:border-black"
            placeholder="Other 5 Title"
            type="text"
            id="other5Title"
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full md:w-auto rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
