package com.spring.chatroomapp.controllers;

import com.spring.chatroomapp.models.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;


@Controller
public class MessageController {
    @MessageMapping("/message")
    @SendTo("/topic/return-to")
    public Message getMessage(@Payload Message message){
        return message;
    }
    @MessageMapping("/message.addUser")
    @SendTo("/topic/return-to")
    public Message addSender(@Payload Message message, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("username",message.getName());
        return message;
    }
}