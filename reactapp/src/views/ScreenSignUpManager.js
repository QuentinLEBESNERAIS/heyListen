import React from 'react';
import {connect} from 'react-redux';
import {Col, Input, Row, Alert, Space, Button} from 'antd';
import {Link} from 'react-router-dom';

function ScreenSignUpManager(props) {

    return (
      <div className="background">
      <Row justify="center" align="middle" style={{height:'20%'}}>
      <Col span={16}>
      <Alert style={{borderRadius: '5px'}}
  message="Bienvenu ! Veuillez remplir les informations ci-dessous pour vous inscrire."
  type="warning"
  action={
    <Space>
       <Link to={'/'}>
      <Button size="small" type="ghost">
        Je suis déjà inscrit
      </Button>
      </Link>
    </Space>
  }
  closable
/>
      </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col span={16} align="middle" className="sign-up-title">
        Mes informations personnelles :
        </Col>
        </Row>
        <Row justify="center" align="top">
        <Col span={16}>
      <div className="sign-up-input-group"> 
      <Input className="sign-up-inputs sign-up-top-input-width" placeholder="Nom" />
      <Input  className="sign-up-inputs sign-up-top-input-width" placeholder="Prénom" />
      </div>
      <div className="sign-up-input-group"> 
      <Input className="sign-up-inputs sign-up-top-input-width" placeholder="Mot de passe" />
      <Input className="sign-up-inputs sign-up-top-input-width" placeholder="Confirmation du mot de passe" />
      </div>
      <div>
      <Input className="sign-up-inputs sign-up-bottom-input-width" placeholder="Entreprise" />
      </div>
      <div>
      <Input className="sign-up-inputs sign-up-bottom-input-width" placeholder="Intitulé du poste" />
      </div>
      </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={16} className="sign-up-button-div">
      <Button className="sign-up-button">S'inscrire</Button>
      </Col>
      </Row>
    </div>
    );
  }
  
  export default connect(
   null,
   null
  )(ScreenSignUpManager);
  