import React,{useState,useEffect} from 'react';
import '../App.css';
import { Slider,Input,Button,Form,Row,Col,Modal,Image} from 'antd'
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import Nav from './Nav'
import {connect} from 'react-redux';

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
            console.log('testid',props.userId._id)
            await fetch('/save-listen', {
                method: 'PUT',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `id=${props.userId._id}&mood=${moodValue}&reponse1=${responseOne}&reponse2=${responseTwo}&reponse3=${responseThree}&reponse4=${responseFour}&reponse5=${responseFive}`
            }); 
        };
        await saveListenCollab()
        setVisible(false);
        }
        
    

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
            <Nav/>
            <Row>
                <Col span={4} offset={10}>    
                    <h4 style={{marginTop:20, marginLeft:20, marginBottom:0}}>Mon humeur du moment</h4>
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
                        <Form.Item label="Question 1" className='input-listen' >
                            <Input onChange={(e) => setResponseOne(e.target.value)} value={responseOne}/>
                        </Form.Item>
                        <Form.Item label="Question 2" className='input-listen' >
                            <Input onChange={(e) => setResponseTwo(e.target.value)} value={responseTwo}/>
                        </Form.Item>
                        <Form.Item label="Question 3" className='input-listen' >
                            <Input onChange={(e) => setResponseThree(e.target.value)} value={responseThree}/>
                        </Form.Item>
                    </Col>
                    <Col span={1}>
                        <div style={{backgroundColor:'#3d84b8',height:"280px", width:"1px", marginTop:"40px"}}></div>
                    </Col>
                    <Col span={10} offset={1}>
                        <h3 className='input-listen'>Mon manager et moi</h3>
                        <Form.Item label="Question 4" className='input-listen' >
                            <Input onChange={(e) => setResponseFour(e.target.value)} value={responseFour}/>
                        </Form.Item>
                        <Form.Item label="Question 5" className='input-listen' >
                            <Input onChange={(e) => setResponseFive(e.target.value)} value={responseFive}/>
                        </Form.Item>
                        <Form.Item >
                            <Button htmlType="submit" className='input-button-listen'
                            style={{backgroundColor:'#3d84b8',color:'white'}}
                            onClick={showModal}>
                                Valider
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>  
            <Modal visible={visible} onCancel={handleCancel} footer={null}>
            <h2 className='input-listen'> 
                {<Image width='30px' src="./logo-transparent.png" />}
                Souhaitez-vous envoyer ce listen :
            </h2>
            <h4>Question 1:</h4>
            <p>{responseOne}</p>
            <h4>Question 2:</h4>
            <p>{responseTwo}</p>
            <h4>Question 3:</h4>
            <p>{responseThree}</p>
            <h4>Question 4:</h4>
            <p>{responseFour}</p>
            <h4>Question 5:</h4>
            <p>{responseFive}</p>
            <div style={{display:'inline'}}>
            <Button key="back" htmlType="submit" 
            style={{backgroundColor:'grey',color:'white',marginLeft:220}}
            onClick={handleCancel}>
                Annuler
            </Button>
            <Button key="submit" 
            style={{backgroundColor:'#3d84b8',color:'white',marginLeft:20}}
            onClick={handleOk}>
                Envoyer le listen
            </Button>
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