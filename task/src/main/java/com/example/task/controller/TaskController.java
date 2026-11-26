package com.example.task.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.task.model.Report;
import com.example.task.model.Task;
import com.example.task.service.TaskService;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController 
public class TaskController {
    
    @Autowired 
    private TaskService taskService;

    /**
     * タスク画面表示
     * @param param
     * @return
     */
    @GetMapping("task")
    public List<Task> getTask() {

        taskService.findTask(LocalDate.now());
        return List.of(
            new Task(1, "資料を作る", LocalDate.now(), "10:00", true, 1.5,
                new Report("要約", "説明", "例"))
        );
    }
    
}
