import React from 'react';
import {connect} from 'react-redux';
import {Col, Input, Row, Alert, Space, Button} from 'antd';
function ScreenSignUpCollab() {

    return (
        <div className="background">
          <Row justify="center" align="middle" style={{height:'20%'}}>
          <Col span={16}>
          <Alert
      message="Bienvenu ! Veuillez remplir les informations ci-dessous pour vous inscrire."
      type="warning"
      action={
        <Space>
          <Button size="small" type="ghost">
            Je suis déjà inscrit
          </Button>
        </Space>
      }
      closable
    />
          </Col>
          </Row>
          <Row justify="center" align="middle">
            <Col span={16} align="middle" style={{fontSize: '2rem', display:'flex', justifyContent:'flex-start'}}>
            Mes informations personnelles :
            </Col>
            </Row>
            <Row justify="center" align="top">
            <Col span={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}> 
          <Input style={{borderRadius: '5px', width:'49%', margin:'2%'}} placeholder="Nom" />
          <Input style={{borderRadius: '5px', width:'49%', margin:'2%'}} placeholder="Prénom" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}> 
          <Input style={{borderRadius: '5px', width:'49%', margin:'2%'}} placeholder="Mot de passe" />
          <Input style={{borderRadius: '5px', width:'49%', margin:'2%'}} placeholder="Confirmation du mot de passe" />
          </div>
          <div>
          <Input style={{borderRadius: '5px', width:'98%', margin:'2%'}} placeholder="Entreprise" />
          </div>
          <div>
          <Input style={{borderRadius: '5px', width:'98%', margin:'2%'}} placeholder="Intitulé du poste" />
          </div>
          </Col>
          </Row>
          <Row justify="center" align="center">
            <Col span={16} style={{display:'flex', justifyContent:'flex-end'}}>
          <Button style={{borderRadius: '5px', marginTop: '30px'}}>S'inscrire</Button>
          </Col>
          </Row>
        </div>
    );
  }
  
  export default connect(
   null,
   null
  )(ScreenSignUpCollab);