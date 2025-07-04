package com.email.email_writer.app;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data


public class EmailRequest {
    private String tone;
    private String emailContent;
}
