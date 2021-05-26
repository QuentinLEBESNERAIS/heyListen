import React, {useState,useEffect} from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button, Form} from 'antd';
import {Redirect} from 'react-router-dom';

function ScreenLogin2(props) {

  const [password, setPassword] = useState('')
  const [invalidPasswordMessage, setinvalidPasswordMessage] = useState('')
  const [loginState, setLoginState] = useState('')

// Fonction gestion du sign-in 
  var handleClickSignIn = async() => {
    if (password){
  // S'il y a un mot de passe, requête vers la base de données
      var resultRaw = await fetch('/users/sign-in', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${props.email}&password=${password}`
      });
      var resultSignIn = await resultRaw.json();
  
  // Retour backend, si mot de passe correct, user enregistré dans le reduceur
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
//EnterPress handler
var handleKeyPress = (event) => {
  console.log(event)
  if(event.charCode === 13){
    handleClickSignIn()
  }
}
  //Focus Password
  const focusPassword= React.useRef(null);
  
  useEffect( async () => {
    focusPassword.current.focus({
      cursor: 'start',
    });
}, [])

  if (loginState == 'dashboard') {
    return (<Redirect to='/dashboard'/>)
  } else {
    return (
      <div className="background">
        <Row justify="center" align="middle" style={{height:'100%'}}>
        <Col span={4} style={{height:'70%', backgroundColor:'#eeeeee',borderRadius:'20px 0 0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <img width={120} src={'./logo-transparent.png'}/>
          <div style={{height: '20%', display: 'flex', alignItems: 'flex-end'}}>
            <p>powered by <img  width={55} src={"./uptoo.svg"}/></p> </div>
          </Col>
            
            <Col span={10} style={{filter:'drop-shadow(-15px 0px 15px -3px #bbbbbb)',height:'70%', backgroundColor:'white',borderRadius:'0 20px 20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{color:'red'}}>
              {invalidPasswordMessage}
            </div>
            <Form>
              <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
                <Input disabled style={{borderRadius: '5px',borderColor:'#0065A2', width:'18rem',marginLeft:"5px", marginRight:'4px'}} placeholder={props.email} />
              </Form.Item>
              <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
                <Input.Password ref={focusPassword} style={{borderRadius: '5px',borderColor:'#0065A2', width:'18rem',marginLeft:"5px", marginRight:'4px'}} placeholder="Mot de passe" onKeyPress={(e)=>handleKeyPress(e)} onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>
              <Button style={{filter:'drop-shadow(5px 5px 15px 5px #0065A2)',marginLeft:175,marginTop:10,borderColor:'#0065A2', color:'#0065A2',borderRadius:'5px'}}  onClick={() => handleClickSignIn()} >Me connecter</Button>
            </Form>
            <div style={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
              <div style={{fontStyle: 'italic'}}>L'application pour les managers VRAIMENT bienveillants !</div>
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