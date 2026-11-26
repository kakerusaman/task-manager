package com.example.task.repository;

import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

import com.example.task.model.TaskRow;

public interface TaskRepository {
    List<TaskRow> findAll(@Param("today") LocalDate toDay);
}
