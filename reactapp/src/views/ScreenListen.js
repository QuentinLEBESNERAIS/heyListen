import React,{useState} from 'react';
import '../App.css';
import { Card,Slider,Input,Button,Form,Row,Col,Modal,Image,message} from 'antd'
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import Nav from './Nav'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'

function ScreenListen(props) {

    const[moodValue,setMoodValue] = useState(1);
    const[responseOne,setResponseOne] = useState('');
    const[responseTwo,setResponseTwo] = useState('');
    const[responseThree,setResponseThree] = useState('');
    const[responseFour,setResponseFour] = useState('');
    const[responseFive,setResponseFive] = useState('');
    const [visible,setVisible] = useState(false)

// Set du Slider
    var handleChange = (value) => {
        setMoodValue(value);
    };

// Enregistrement du Listen Collab
    const showModal = () => {
        setVisible(true);
    };
    
    const handleOk = async () => {
        var saveListenCollab = async () => {
            await fetch('/save-listen', {
                method: 'PUT',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `id=${props.userId._id}&mood=${moodValue}&reponse1=${responseOne}&reponse2=${responseTwo}&reponse3=${responseThree}&reponse4=${responseFour}&reponse5=${responseFive}`
            }); 
        };
        await saveListenCollab()
        setVisible(false);
        message.success('Votre Listen a bien été enregistré')
    }

    const handleCancel = () => {
        setVisible(false);
    };
    
    const {TextArea} = Input

    return (
        <div>
            <Nav/>
            <Row style={{background: `linear-gradient(180deg, #FFFFFF, #00BFA6 90%, #00a38d)`, width:'100%', minHeight: '100vh'}}>
                <Col span={22} offset={1}> 
                    <Card style ={{filter:'drop-shadow(1px 2px 5px #555555)',borderRadius:20, margin:12,marginTop:"60px"}}>
                        <Row>
                            <Col span={4} offset={10}>    
                                <h4 style={{marginLeft:10, marginBottom:0}}>Mon humeur du moment</h4>
                            </Col>
                        </Row>
                        <div className="icon-wrapper">
                            <FrownOutlined style={{color:'#A62626'}}/>
                            <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value={moodValue} min={1} max={5} onChange={(value) => handleChange(value)}/>
                            <SmileOutlined style={{color:'#448f30'}}/>
                        </div>
                        <Form layout="vertical" >
                            <Row > 
                                <Col span={10} offset={2}>
                                    <h3 className='input-listen'>Mon Listen</h3>
                                    <Form.Item label="Les points positifs de la période" className='input-listen' >
                                        <TextArea rows={4} onChange={(e) => setResponseOne(e.target.value)} value={responseOne}/>
                                    </Form.Item>
                                    <Form.Item label="Quelles ont été les difficultés de la période ?" className='input-listen' >
                                        <TextArea rows={4} onChange={(e) => setResponseTwo(e.target.value)} value={responseTwo}/>
                                    </Form.Item>
                                    <Form.Item label="Mon objectif prioritaire pour le mois prochain" className='input-listen' >
                                        <TextArea rows={4} onChange={(e) => setResponseThree(e.target.value)} value={responseThree}/>
                                    </Form.Item>
                                </Col>
                                <Col span={1}>
                                    <div style={{backgroundColor:'#3d84b8',height:"480px", width:"1px", marginTop:"40px"}}></div>
                                </Col>
                                <Col span={10} offset={1}>
                                    <h3 className='input-listen'>Mon manager et moi</h3>
                                    <Form.Item label="Qu'attends-je de mon manager pour le mois prochain ?" className='input-listen' >
                                        <TextArea rows={4} onChange={(e) => setResponseFour(e.target.value)} value={responseFour}/>
                                    </Form.Item>
                                    <Form.Item label="Un point sur lequel j'aimerais revenir" className='input-listen' >
                                        <TextArea rows={4} onChange={(e) => setResponseFive(e.target.value)} value={responseFive}/>
                                    </Form.Item>
                                    <Form.Item >
                                        <Button htmlType="submit" className='input-button-listen'
                                        style={{marginLeft:220, borderColor:'#00BFA6',color:'#00BFA6',filter:'drop-shadow(1px 1px 1px #00BFA6)',borderRadius:40}}
                                        onClick={showModal}>
                                            Valider
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>  
                    </Card>
                </Col>
            </Row>
            <Modal className='center' visible={visible} onCancel={handleCancel} footer={null}>
                <h2 className='input-listen'> 
                    {<Image width='30px' src="./logo-transparent.png" />}
                    Souhaitez-vous envoyer ce listen ? 
                </h2>
                <div className="icon-wrapper">
                    <FrownOutlined style={{color:'#A62626'}}/>
                    <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value={moodValue} min={1} max={5}/>
                    <SmileOutlined style={{color:'#448f30'}}/>
                </div>
                <h4 style={{textDecoration:'underline'}}>Les points positifs de la période</h4>
                <p style={{color:'#00BFA6'}}>{responseOne}</p>
                <h4 style={{textDecoration:'underline'}}>Quelles ont été les difficultés de la période ?</h4>
                <p style={{color:'#00BFA6'}}>{responseTwo}</p>
                <h4 style={{textDecoration:'underline'}}>Mon objectif prioritaire pour le mois prochain</h4>
                <p style={{color:'#00BFA6'}}>{responseThree}</p>
                <h4 style={{textDecoration:'underline'}}>Qu'attends-je de mon manager pour le mois prochain?</h4>
                <p style={{color:'#00BFA6'}}>{responseFour}</p>
                <h4 style={{textDecoration:'underline'}}>Un point sur lequel j'aimerais revenir</h4>
                <p style={{color:'#00BFA6'}}>{responseFive}</p>
                <div style={{display:'inline'}}>
                    <Button key="back" htmlType="submit" style={{marginLeft:220, borderColor:'grey',color:'grey',borderRadius:240,filter:'drop-shadow(1px 1px 1px grey)'}} onClick={handleCancel}>
                        Annuler
                    </Button>
                    <Link to='/dashboard-collab'>
                        <Button key="submit" style={{marginLeft:20, borderColor:'#00BFA6',color:'#00BFA6',filter:'drop-shadow(1px 1px 1px #00BFA6)',borderRadius:40}} onClick={handleOk}>
                            Envoyer ce listen
                        </Button>
                    </Link>
                </div>
            </Modal>
        </div>
    );
}

function mapStateToProps(state) {console.log('testStore',state.user._id )
    return { userId: state.user }
}

export default connect(
    mapStateToProps,
    null
)(ScreenListen);