import React from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button} from 'antd';
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined} from '@ant-design/icons'

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
        <LockOutlined style={{ fontSize: '24px' }}/>
        <Input style={{borderRadius: '5px', width:'18rem',marginLeft:"5px", marginRight:'4px'}} placeholder="Votre mot de passe" />
        <Button style={{borderRadius: '5px'}}>Me connecter</Button>
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