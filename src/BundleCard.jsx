const BundleCard = ({ bundle, onBuy }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 relative ${
      bundle.popular ? 'ring-2 ring-blue-500' : ''
    }`}>
      {bundle.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{bundle.name}</h3>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-blue-600">{bundle.uploads}</span>
          <span className="text-gray-600 ml-2">uploads</span>
        </div>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">KES {bundle.price}</span>
        </div>
        
        <p className="text-gray-600 mb-6">{bundle.description}</p>
        
        <button
          onClick={onBuy}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            bundle.popular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          Buy Bundle
        </button>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-600">{bundle.uploads} document checks</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-600">Plagiarism detection</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-600">AI content detection</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-600">PDF reports</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-600">30-day access</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BundleCard;
