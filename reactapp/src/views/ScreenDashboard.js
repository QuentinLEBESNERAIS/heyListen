import React,{useState} from 'react';
import '../App.css';
import {Button,Empty,Row,Col,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image, message} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined} from '@ant-design/icons';
import {Link, Redirect} from 'react-router-dom'
import Nav from './Nav'
import {connect} from 'react-redux';
import {Line} from 'react-chartjs-2';

function ScreenDashboard(props) {
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const[feedbackOne,setFeedbackOne] = useState('');
    const[feedbackTwo,setFeedbackTwo] = useState('');
    const [collabEmail,setCollabEmail] = useState ('');
    const [errorMessage, setErrorMessage] = useState('');
    
// Paramètres modale feedback manager
    const showModal1 = () => {
        setVisible1(true);
    };
    
    const handleOk1 = async () => {
        var saveFeedback = async () => {
            await fetch('/save-feedback', {
                method: 'PUT',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `id=${props.user._id}=${feedbackOne}&feedback2=${feedbackTwo}`
            });
            await saveFeedback()
        }
        setVisible1(false);
    };

    const handleCancel1 = () => {
        setVisible1(false);
    };

// Paramètres modale feedback mananger
    const showModal2 = () => {
        setVisible2(true);
    };
    
    const handleOk2 = async () => {
        if (collabEmail) {
            var emailReg = new RegExp(/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i);
            var valid = emailReg.test(collabEmail);
            if(!valid){
                setErrorMessage("Veuillez entrer un email valide")
            } else {
                var saveCollab = async () => {
                    var responseRaw = await fetch('/users/add-collab', {
                        method: 'POST',
                        headers: {'Content-Type':'application/x-www-form-urlencoded'},
                        body: `collabEmail=${collabEmail}&userId=${props.userId._id}`
                    });
                    var response = await responseRaw.json();
                    console.log('response', response)
                    const info = () => {
                        message.info(response.response);
                      }
                      info();
                } 
                await saveCollab()
                setVisible2(false);
            }
        }
    };

    const handleCancel2 = () => {
        setVisible2(false);
    };

// NEW CAMPAIGN
    var newCampaignLaunch = async () => {
        const data = await fetch('/new-campaign', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `idFromFront=${props.userId._id}`
        })
        const info = () => {
            message.info('Nouvelle campagne lancée avec succés !');
        }
        info();
        const body = await data.json()
    }

    const state = {
        labels: ['January', 'February', 'March',
                 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Humeur',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: true,
            lineTension: 0.4,
            data: [3, 5, 4, 1, 3, 2],
          }
        ]
      }
    

    if(props.userId.type==="manager"){
    return (
        <div>
            <Nav/>
            <Row style={{height:65}}>
                <Col span={8} offset={1}>
                    <h4 style={{marginTop:20}}>Taux de complétion :        
                    <Progress percent={50} size="small" status="active" />
                    </h4> 
                </Col>
            </Row>
            <Row >
            <Col span={22} offset={1} height={50}>
              <Line 
              height={50}
               data={state}
               options={{

                 title:{
                   display:false,
                 },
                 legend:{
                   display:true,
                 },
                 plugins:{
                     legend:{
                         display:false
                     }
               }}}>
               </Line>

            </Col>
            </Row>
            <Row style={{marginTop:20}}>
                <Col span={8} offset={2}>
                    <h4 style={{paddingRight:8}}>
                        <SendOutlined style={{color:'#3d84b8', paddingRight:5}}/>
                        Envoyer un rappel
                    </h4>
                </Col>
                <Col span={6} offset={6}>
                    <Form>
                        <Form.Item label="Rechercher:" style={{fontWeight:'500'}} >
                            <Input placeholder="Collaborateur" style={{ width: 200 }} />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col span={22} offset={1}>
                    <List itemLayout="horizontal">
                        <List.Item style={{border:'1px solid black',padding:10,margin:5}}>
                            <Avatar style={{ backgroundColor:'#3d84b8', verticalAlign: 'middle' }} 
                            size="large">
                            MD
                            </Avatar>
                            <Typography.Text>Michel Dupont</Typography.Text>
                            <div>
                                <Tag color='#A62626' 
                                style={{borderRadius:'10px',width:200,textAlign:'center'}}>
                                    Michel n'a pas rempli son Listen
                                </Tag>
                                <Tag color='#448f30' 
                                style={{borderRadius:'10px',width:200,textAlign:'center'}}>
                                    Vous avez rempli votre partie
                                </Tag>
                            </div>
                            <HistoryOutlined style={{ fontSize: '24px' }}/>
                            <div>
                                <EyeOutlined style={{ fontSize: '24px',marginRight:5,color:'white'}}
                                />
                                <EditOutlined onClick={showModal1} style={{ fontSize: '24px' }}/>
                            </div>
                        </List.Item>
                        <List.Item style={{border:'1px solid black',padding:10,margin:5}}>
                            <Avatar style={{ backgroundColor:'#3d84b8', verticalAlign: 'middle' }} 
                            size="large">
                                MD
                            </Avatar>
                            <Typography.Text>Michele Dupon</Typography.Text>
                            <div>
                                <Tag color='#448f30' 
                                style={{borderRadius:'10px',width:200,textAlign:'center'}}>
                                    Michele a rempli son Listen
                                </Tag>
                                <Tag color='#448f30' 
                                style={{borderRadius:'10px',width:200,textAlign:'center'}}>
                                    Vous avez rempli votre partie
                                </Tag>
                            </div>
                            <HistoryOutlined style={{ fontSize: '24px' }}/>
                            <div>
                                <EyeOutlined style={{ fontSize: '24px',marginRight:5 }}/>
                                <LockOutlined style={{ fontSize: '24px' }}/>
                            </div>
                        </List.Item>
                    </List>  
                </Col>
            </Row> 
            <Row style={{marginTop:20}}>
                <Col span={8} offset={2}>
                    <h4>Ajouter un collaborateur
                    <UserAddOutlined 
                    onClick={showModal2}
                    style={{color:'#3d84b8', paddingLeft:5,fontSize: '20px',fontWeight:'bold'}} 
                    />
                    </h4>
                </Col>
                <Col onClick={() => newCampaignLaunch()} span={6} offset={6} >
                    <h4>Lancer une nouvelle campagne de Listens
                    <PlusOutlined 
                    style={{color:'#3d84b8', paddingLeft:5,fontSize: '20px',fontWeight:'bold'}} 
                    />
                    </h4> 
                </Col>
            </Row>

            <Modal visible={visible1} onCancel={handleCancel1} footer={null}>
                <Form layout="vertical" >
                    <h2 className='input-listen'> 
                        {<Image width='30px' src="./logo-transparent.png" />}
                        Concernant Michel Dupont :
                    </h2>
                    <Form.Item label="Qu'avez vous pensez de la performance de Michel ?" 
                    className='input-listen' >
                        <Input onChange={(e) => setFeedbackOne(e.target.value)}
                        value={feedbackOne}/>
                    </Form.Item>
                    <Form.Item label="Qu'attendez vous de Michel pour le mois prochain ?" 
                    className='input-listen'>
                        <Input onChange={(e) => setFeedbackTwo(e.target.value)}
                        value={feedbackTwo}/>
                    </Form.Item>
                    <Form.Item layout="horizontal" style={{marginTop:30}}>
                            <Button key="back" htmlType="submit" 
                            style={{backgroundColor:'grey',color:'white',marginLeft:240}}
                            onClick={handleCancel1}>
                                Annuler
                            </Button>
                            <Button key="submit" 
                            style={{backgroundColor:'#3d84b8',color:'white',marginLeft:20}}
                            onClick={()=> handleOk1() }>
                            Valider
                            </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal visible={visible2} onCancel={handleCancel2} footer={null} width={700} height={500}>
                <div style={{color:'red', display:'flex', justifyContent:'center'}}>
                    {errorMessage}
                </div>
                <Form layout="inline" >
                    <h2 className='input-listen'> 
                        {<Image width='30px' src="./logo-transparent.png" />}
                        Collaborateur à ajouter :
                    </h2>
                    <Form.Item layout="horizontal" style={{marginTop:30,padding:0}}>
                        <Input placeholder='Email du collaborateur'
                        onChange={(e) => setCollabEmail(e.target.value)}
                        value={collabEmail}/>
                    </Form.Item>
                    <Form.Item layout="horizontal" style={{marginTop:30}}>
                            <Button key="back" htmlType="submit" 
                            style={{backgroundColor:'grey',color:'white',marginLeft:335}}
                            onClick={handleCancel2}>
                                Annuler
                            </Button>
                            <Button key="submit" 
                            style={{backgroundColor:'#3d84b8',color:'white',marginLeft:20}}
                            onClick={()=> handleOk2()}>
                                Ajouter ce collaborateur
                            </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
        </div>
    )}
    else{return <Redirect to='/historique-collab'/> };
}

function mapStateToProps(state) {
    console.log('test userStore',state.user._id)
    return { userId: state.user }
}

export default connect(
    mapStateToProps,
    null
)(ScreenDashboard);