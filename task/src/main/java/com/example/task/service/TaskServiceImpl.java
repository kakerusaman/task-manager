package com.example.task.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.task.model.TaskRow;
import com.example.task.repository.TaskRepository;

import jakarta.annotation.Resource;

/**
 * タスクサービスのインターフェース
 * TaskServiceImp
 */
public class TaskServiceImpl implements TaskService {

    @Autowired 
    @Resource(name = "TaskRepository")
    private TaskRepository taskRepository;


    public List<TaskRow> findTask(LocalDate toDay) {
        return taskRepository.findAll(toDay);
    }
    
}
