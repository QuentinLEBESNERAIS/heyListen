import React, { useState } from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button, Form} from 'antd';
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined} from '@ant-design/icons'

function ScreenLogin2(props) {

  const [password, setPassword]=useState('')

    return (
      <div className="background">
      <Row justify="center" align="middle" style={{height:'100%'}}>
        <Col span={14} style={{height:'70%', backgroundColor:'white', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <img
        width={200}
        src={'./logo-transparent.png'}
        />
        <Form>

        <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
        <Input disabled style={{borderRadius: '5px', width:'18rem',marginLeft:"5px", marginRight:'4px'}} placeholder="email" />
        </Form.Item>

        <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
        <Input.Password style={{borderRadius: '5px', width:'18rem',marginLeft:"5px", marginRight:'4px'}} placeholder="mot de passe" />
        </Form.Item>

        <Button style={{marginLeft:172, borderRadius: '5px'}}>Me connecter</Button>
        
        </Form>
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
  )(ScreenLogin2);