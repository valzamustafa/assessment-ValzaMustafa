
import { Link } from 'react-router-dom';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionLink 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6"
      >
        {Icon && <Icon className="h-12 w-12 text-gray-400" />}
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionText && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary" size="lg">
            {actionText}
          </Button>
        </Link>
      )}
    </motion.div>
  );
};

export default EmptyState;