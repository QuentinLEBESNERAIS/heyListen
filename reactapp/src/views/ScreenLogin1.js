import React, { useState } from 'react';
import {connect} from 'react-redux';
import {Col, Row, Input, Button} from 'antd';
import { Redirect } from 'react-router';

function ScreenLogin1(props) {

  const [email, setEmail] = useState("")
  const [invalidEmailMessage, setinvalidEmailMessage] = useState("")

  var handleSubmitSignIn = async() => {
    if (email){
    var resultRaw = await fetch('/check-email', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${email}`
       });
       var resultCheckEmail = await resultRaw.json();
     console.log('resultCheckEmail', resultCheckEmail)

     if (resultCheckEmail.response == 'EmailInvalide'){
      setinvalidEmailMessage("Veuillez entrer un email valide")
    } else if (resultCheckEmail.response == 'login2') {
      props.saveEmail(email)
      return (<Redirect to='/login2' />)
    } else if (resultCheckEmail.response == 'signUpCollab'){
      props.saveEmail(email)
      return (<Redirect to='/sign-up-collab' />)
    } else {
      props.saveEmail(email)
      return (<Redirect to='/sign-up-manager' />)
    }
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
        <div style={{marginTop: '20px'}}>
          {invalidEmailMessage}
        <Input
        style={{borderRadius: '5px', width:'18rem', marginRight:'4px'}} 
        placeholder="Votre email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        />
        <Button 
        style={{borderRadius: '5px'}}
        onClick={() => handleSubmitSignIn()} 
        >Valider</Button>
        </div>
        <div style={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
        <div style={{fontStyle: 'italic'}}>Hey Listen, l'application pour les managers VRAIMENT bienveillants !</div>
        </div>
        </Col>
      </Row>
    </div>
    );
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      saveEmail: function(email) {
          dispatch( {type: 'saveEmail', email: email} )
      }
    }
   }

  export default connect(
   null,
   mapDispatchToProps
  )(ScreenLogin1);