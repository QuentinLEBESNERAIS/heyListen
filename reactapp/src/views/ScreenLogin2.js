import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button, Form} from 'antd';
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined} from '@ant-design/icons'

function ScreenLogin2(props) {

  const [password, setPassword] = useState('')
  const [invalidPasswordMessage, setinvalidPasswordMessage] = useState('')

  var handleClickSignIn = async() => {
    if (password){
    var passwordReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i);
    var valid = passwordReg.test(password);
    if (!valid) {
      setinvalidPasswordMessage("Le mot de passe doit contenir au minimum 8 caractères dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial")
    } else {
    var resultRaw = await fetch('/users/check-email', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${email}`
       });
       var resultCheckEmail = await resultRaw.json();
     console.log('resultCheckEmail', resultCheckEmail)   
    if (resultCheckEmail.response == 'login2') {
      props.saveEmail(email)
      setLoginState('login2')
    } else if (resultCheckEmail.response == 'signUpCollab'){
      props.saveEmail(email)
      setLoginState('sign-up-collab')
    } else {
      props.saveEmail(email)
      setLoginState('sign-up-manager')
    }
  } 
  } else {
    setinvalidEmailMessage('Veuillez rentrer un email')
  }
} 

    return (
      <div className="background">
      <Row justify="center" align="middle" style={{height:'100%'}}>
        <Col span={14} style={{height:'70%', backgroundColor:'white', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <img
        width={200}
        src={'./logo-transparent.png'}
        />
        <div style={{color:'red'}}>
        {invalidPasswordMessage}
        </div>
        <Form>

        <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
        <Input disabled style={{borderRadius: '5px', width:'18rem',marginLeft:"5px", marginRight:'4px'}} placeholder={props.email} />
        </Form.Item>

        <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
        <Input.Password style={{borderRadius: '5px', width:'18rem',marginLeft:"5px", marginRight:'4px'}} placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>

        <Button style={{marginLeft:172, borderRadius: '5px'}}  onClick={() => handleClickSignIn(props.email, password)} >Me connecter</Button>
        
        </Form>
        <div style={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
        <div style={{fontStyle: 'italic'}}>Hey Listen, l'application pour les managers VRAIMENT bienveillants !</div>
        </div>
        </Col>
      </Row>
    </div>
    );
  }

  function mapStateToProps(state){
    return {email: state.email}
  }
  
  export default connect(
   mapStateToProps,
   null
  )(ScreenLogin2);