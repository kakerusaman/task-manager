package com.example.task.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


/**
 * ログインコントローラー
 * LoginController
 */

@Controller 
public class LoginController {
    
    /**
     * 初期表示
     */
    @RequestMapping(value = "login", method=RequestMethod.GET)
    public String login(Model model) {
        model.addAttribute("message", "hoge");
        return "login";
    }
    
}
