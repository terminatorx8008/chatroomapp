package com.spring.chatroomapp.models;


import lombok.*;

import javax.swing.text.html.parser.AttributeList;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    private String name;
    private String content;
    private MessageType type;

}
