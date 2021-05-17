import React,{useState} from 'react';
import '../App.css';
import { Slider,Input,Button,Form,Row,Col} from 'antd'
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import Nav from './Nav'

function ScreenListen(props) {
    const[moodValue,setMoodValue] = useState(1);
    const[responseOne,setResponseOne] = useState('');
    const[responseTwo,setResponseTwo] = useState('');
    const[responseThree,setResponseThree] = useState('');
    const[responseFour,setResponseFour] = useState('');
    const[responseFive,setResponseFive] = useState('');

      // Set du Slider
   var handleChange = (value) => {
        setMoodValue(value);
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
            <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value ={moodValue} 
            min={1} max={5} onChange={(value) => handleChange(value)}/>
            <SmileOutlined style={{color:'#448f30'}}/>
      </div>

      
           
        <Form layout="vertical" >

            <Row > 
                <Col span={10} offset={2}>

                    <h3 className='input-listen'>Mon Listen</h3>

                    <Form.Item label="Question 1" className='input-listen' >
                        <Input onChange={(e) => setResponseOne(e.target.value)}

                        value={responseOne}/>
                    </Form.Item>

                    <Form.Item label="Question 2" className='input-listen' >
                        <Input onChange={(e) => setResponseTwo(e.target.value)}

                        value={responseTwo}/>
                    </Form.Item>

                    <Form.Item label="Question 3" className='input-listen' >
                        <Input onChange={(e) => setResponseThree(e.target.value)}

                        value={responseThree}/>
                    </Form.Item>

                </Col>

                <Col span={1}>
                    <div style={{backgroundColor:'#3d84b8',height:"280px",
                    width:"1px", marginTop:"40px"}}>
                    </div>
                </Col>

                <Col span={10} offset={1}>

                    <h3 className='input-listen'>Mon manager et moi</h3>

                    <Form.Item label="Question 4" className='input-listen' >
                        <Input onChange={(e) => setResponseFour(e.target.value)}

                        value={responseFour}/>
                    </Form.Item>

                    <Form.Item label="Question 5" className='input-listen' >
                        <Input onChange={(e) => setResponseFive(e.target.value)}

                        value={responseFive}/>
                    </Form.Item>

                    <Form.Item >
                        <Button htmlType="submit" className='input-button-listen'
                        style={{backgroundColor:'#3d84b8',color:'white'}}
                        onClick={()=> console.log('test',moodValue, responseOne, responseTwo, responseThree, responseFour,responseFive) }>
                        Valider
                        </Button>
                    </Form.Item>

                </Col>
            </Row>
   
        </Form>  
    
                 
      </div>
  );
}


export default ScreenListen
