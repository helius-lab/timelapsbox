# TimelapseBox - Документация

## Содержание

1. [Введение и цели проекта](01_introduction.md)

   - Описание системы TimelapseBox
   - Цели исследования
   - Задачи исследования
   - Планируемые результаты

2. [Структура документации](02_documentation_structure.md)

   - Инженерный дневник
   - Технический отчёт
   - Организация документации в репозитории

3. [Метрики качества итогового видео](03_video_quality_metrics.md)

   - Плавность движения
   - Отсутствие мерцания (flicker)
   - Цветопередача и тональная коррекция
   - Детализация и чёткость
   - Стабильность кадра
   - Художественность
   - Технические параметры видео

4. [Анализ параметров камеры и съёмки, влияющих на эстетику](04_camera_parameters_aesthetics.md)
   - Формат и качество исходных изображений
   - Выдержка и частота кадров
   - Диафрагма и глубина резкости
   - ISO и шум
   - Баланс белого и цветовые профили
   - Режим съёмки и дополнительные настройки

5. [Анализ параметров обработки (ffmpeg и сопутствующие инструменты)](05_ffmpeg_processing_parameters.md)
   - Частота кадров (FPS) итогового видео
   - Выбор кодека и качество сжатия (CRF)
   - Стабилизация видео
   - Фильтры пост-обработки для художественного эффекта
   - Сборка таймлапса (интеграция всего процесса)

6. [Надёжность системы (долговременная съёмка)](06_system_reliability.md)
   - Метрики надёжности
   - Возможные точки отказа и решения
   - Методы повышения надёжности
   - Испытания
   - Документирование надёжности
   - Обслуживание плановое

7. [Энергоэффективность (анализ и оптимизация энергопотребления)](07_energy_efficiency.md)
   - Замер текущего потребления
   - Выбор вычислительной платформы
   - Wi-Fi / 4G модули
   - Duty Cycle работы
   - Питание камеры
   - Солнечное питание
   - Метрики энергоэффективности
   - Реализация аппаратных улучшений для энергии

8. [Возможные улучшения аппаратной части](08_hardware_improvements.md)
   - Улучшенная камера и объективы
   - Фильтры и механизмы фильтров
   - Панорамная головка / слайдер
   - Аппаратный контроллер питания
   - Система питания
   - Корпус и защита
   - Дополнительные датчики
   - Модульность

9. [Возможные улучшения программной части](09_software_improvements.md)
   - Алгоритмы устранения мерцания (Deflicker)
   - Продвинутая цветокоррекция с LUT
   - UI/веб-интерфейс
   - Облачная интеграция
   - Скрипты анализа кадров
   - Оптимизация производительности
   - Сценарии съёмки

10. [Рекомендации по структуре репозитория, презентации и финальному отчёту](10_repository_structure_report.md)
    - Структура репозитория (GitHub)
    - Презентация (слайды)
    - Визуальный стиль
    - Демонстрация видео