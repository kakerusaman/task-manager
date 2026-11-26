package com.example.task.service;

import java.time.LocalDate;
import java.util.List;
import com.example.task.model.TaskRow;

/**
 * タスクサービスのインターフェース
 * TaskServiceImp
 */
public interface TaskService {
    /**
     * タスク情報を月毎に取得（前月・翌月の日付も見える分は取得する
     */
    List<TaskRow> findTask(LocalDate today);
    
    
}
