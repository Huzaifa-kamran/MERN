import React from 'react'

const Modal = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow dark:bg-gray-700 p-4 md:p-5">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Update Todo
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Here you can update the details of your todo item.
      </p>
      <div className="flex items-center mt-4">
        <button
          type="button"
          onClick={() => setShowModal(false)} // Close modal
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  )
}

export default Modal