package com.example.task.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import com.example.task.model.TaskRow;

@Mapper 
public interface TaskRepository {
    List<TaskRow> findAll(@Param("today") LocalDate toDay);
}
