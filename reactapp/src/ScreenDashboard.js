import React,{useState} from 'react';
import './App.css';
import {Button,Empty,Row,Col,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image} from 'antd'
import { SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined} from '@ant-design/icons';
import Nav from './Nav'

function ScreenDashboard(props) {
    const [visible, setVisible] = useState(false);
    const[feedbackOne,setFeedbackOne] = useState('');
    const[feedbackTwo,setFeedbackTwo] = useState('');
    
// Paramètres modale feedback mananger
    const showModal = () => {
        setVisible(true);
    };
    
    const handleOk = () => {
        console.log('test',feedbackOne)
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

  return (
      
    <div>
        <div className="background">
        <Nav/>

        </div>
        

        <Row>
            <Col span={8} offset={1}>
                <h4 style={{marginTop:20}}>Taux de complétion :        
                <Progress percent={50} size="small" status="active" />
                </h4> 
            </Col>
        </Row>

        <Empty/>

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
                        <EditOutlined onClick={showModal} style={{ fontSize: '24px' }}/>
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
                style={{color:'#3d84b8', paddingLeft:5,fontSize: '20px',fontWeight:'bold'}} 
                />
                </h4>
            </Col>

            <Col span={6} offset={6} >
                <h4>Lancer une nouvelle campagne de Listens
                <PlusOutlined 
                style={{color:'#3d84b8', paddingLeft:5,fontSize: '20px',fontWeight:'bold'}} 
                />
                </h4> 
            </Col>

        </Row>

        <Modal
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form layout="vertical" >

                <h2 className='input-listen'> 
                {<Image width='30px' src="./logo.png" />}
                Concernant Michel Dupont :
                </h2>

                <Form.Item label="Qu'avez vous pensez de la performance de Michel ?" 
                className='input-listen' >
                    <Input onChange={(e) => setFeedbackOne(e.target.value)}

                    value={feedbackOne}/>
                </Form.Item>

                <Form.Item label="Qu'attendez vous de Michel pour le mois prochain ?" 
                className='input-listen' >
                    <Input onChange={(e) => setFeedbackTwo(e.target.value)}

                    value={feedbackTwo}/>
                </Form.Item>

                <Form.Item layout="horizontal" style={{marginTop:30}}>

                        <Button key="back" htmlType="submit" 
                        style={{backgroundColor:'grey',color:'white',marginLeft:240}}
                        onClick={handleCancel}>
                         Annuler
                        </Button>

                        <Button key="submit" 
                        style={{backgroundColor:'#3d84b8',color:'white',marginLeft:20}}
                        onClick={()=> handleOk() }>
                        Valider
                        </Button>
                    
                </Form.Item>

            </Form>

        </Modal>
    </div>
  );
}


export default ScreenDashboard;
