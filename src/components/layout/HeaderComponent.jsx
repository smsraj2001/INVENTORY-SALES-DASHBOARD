import React from 'react';
import './HeaderComponent.css';

const HeaderComponent = () => {
  return (
    <div className="container-fluid bgheader">
      <div id="heading" className="d-flex align-items-center">
      <h1 className="mx-auto">TVS MOTOR COMPANY LIMITED</h1>

        <img src="/logo/tvslogo.jpg" alt="TVS Motors" className="imgfloat" width="100px" height="50px" />
      </div>
    </div>
  );
};

export default HeaderComponent;
