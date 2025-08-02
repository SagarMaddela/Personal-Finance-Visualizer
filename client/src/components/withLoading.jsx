import React from 'react';
import Loader from './Loader';

const withLoading = (WrappedComponent, loaderProps = {}) => {
  return function WithLoadingComponent(props) {
    const { loading, ...otherProps } = props;
    
    if (loading) {
      return <Loader {...loaderProps} />;
    }
    
    return <WrappedComponent {...otherProps} />;
  };
};

export default withLoading; 