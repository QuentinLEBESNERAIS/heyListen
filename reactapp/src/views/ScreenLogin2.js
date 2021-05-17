import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button, Form} from 'antd';
import {Redirect} from 'react-router-dom';

function ScreenLogin2(props) {

  const [password, setPassword] = useState('')
  const [invalidPasswordMessage, setinvalidPasswordMessage] = useState('')
  const [loginState, setLoginState] = useState('')

  var handleClickSignIn = async() => {
    if (password){
      var resultRaw = await fetch('/users/sign-in', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${props.email}&password=${password}`
      });
      var resultSignIn = await resultRaw.json();
      console.log('resultSignIn', resultSignIn)   
      if (resultSignIn.response == 'connect'){
        props.saveUser(resultSignIn.user)
        setLoginState('dashboard')
      } else {
        setinvalidPasswordMessage('Le mot de passe est incorrect')
      }
    } else {
      setinvalidPasswordMessage('Veuillez entrer un mot de passe')
    }
  } 

  if (loginState == 'dashboard') {
    return (<Redirect to='/dashboard'/>)
  } else {
    return (
      <div className="background">
        <Row justify="center" align="middle" style={{height:'100%'}}>
          <Col span={14} style={{height:'70%', backgroundColor:'white', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <img width={200} src={'./logo-transparent.png'}/>
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
              <Button style={{marginLeft:172, borderRadius: '5px'}}  onClick={() => handleClickSignIn()} >Me connecter</Button>
            </Form>
            <div style={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
              <div style={{fontStyle: 'italic'}}>Hey Listen, l'application pour les managers VRAIMENT bienveillants !</div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {email: state.email}
}

function mapDispatchToProps(dispatch) {
  return {
    saveUser: function(user) {
      dispatch( {type: 'logUser', user: user} )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenLogin2);