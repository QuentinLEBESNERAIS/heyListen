import React from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button} from 'antd';

function ScreenLogin1() {

    return (
      <div className="background">
      <Row justify="center" align="middle" style={{height:'100%'}}>
        <Col span={14} style={{height:'70%', backgroundColor:'white', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <img
        width={200}
        src={'./logo-transparent.png'}
        />
        <div style={{marginTop: '20px'}}>
        <Input style={{borderRadius: '5px', width:'18rem', marginRight:'4px'}} placeholder="Votre email" />
        <Button style={{borderRadius: '5px'}}>Valider</Button>
        </div>
        <div style={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
        <div style={{fontStyle: 'italic'}}>Hey Listen, l'application pour les managers VRAIMENT bienveillants !</div>
        </div>
        </Col>
      </Row>
    </div>
    );
  }
  
  export default connect(
   null,
   null
  )(ScreenLogin1);