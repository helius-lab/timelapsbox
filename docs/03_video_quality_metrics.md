# Метрики качества итогового видео

Чтобы оценивать «эстетичность» и техническое качество таймлапс-видео, вводятся метрики качества – как объективные, так и субъективно-визуальные:

## Плавность движения

Измеряется через стабильность шага между кадрами и отсутствие рывков. Объективно можно контролировать постоянство частоты кадров и длительности экспозиции. Субъективно – видео должно восприниматься плавно, без эффектов staccato (дёрганого движения). Например, слишком короткая выдержка при съёмке вызывает резкие движения на таймлапсе, а более длинная выдержка сглаживает движение за счёт смаза.

## Отсутствие мерцания (flicker)

Критически важно для профессионального вида. Мерцание проявляется как непостоянство яркости или цвета от кадра к кадру. Метрикой может служить темпоральная стабильность экспозиции: например, стандартное отклонение среднего уровня яркости между соседними кадрами (чем меньше, тем лучше). Цель – достичь практически нулевых перепадов освещённости, чтобы видео выглядело равномерным. Существует программный инструментарий для устранения фликера на этапе пост-обработки (deflicker). Успешное устранение мерцания приводит к «безупречным профессиональным последовательностям», что и станет показателем качества.

## Цветопередача и тональная коррекция

Видео должно иметь приятные глазу цвета, соответствующее настроение (например, тёплые тона заката или холодные ночные), без цветовых скачков. Метрика может быть более субъективной, но можно использовать гистограммы: сравнивать распределение цветов по всему видео, стремясь к плавному изменению цветового баланса без резких всплесков. Визуально оценивается целостность цветовой гаммы. Например, применение единого LUT на весь ролик гарантирует консистентность цветокоррекции.

## Детализация и чёткость

Оценивается по тому, насколько видео сохраняет детали исходных фотографий, отсутствие размытия (кроме намеренного от движения) и отсутствуют ли артефакты компрессии. Объективно можно мерить разрешение (например, финальное видео 4K vs 1080p), уровень шума (сигнал/шум, особенно в тенях), а также использовать показатели вроде PSNR/SSIM между нежатым и сжатым видео для оценки влияния кодека. Визуально проверяется, что нет заметных блоков, пикселизации или лишней мягкости. Настройка низкого ISO при съёмке и достаточного битрейта при кодировании служит этому критерию.

## Стабильность кадра

Отсутствие дрожания, смещения кадра или других нежелательных подвижек камеры. Метрика – если камера статична, то положение ключевых объектов в кадре должно меняться минимально (можно вычислить смещение между кадрами с помощью функций корреляции). Если использовалась программная стабилизация, оценивается процент обрезки кадра и остаточное дрожание. Оптимально, чтобы видео выглядело как снятое с надёжного штатива или плавного слайдера. Использование ffmpeg-стабилизации (например, модуля VidStab) помогает компенсировать мелкие сдвиги.

## Художественность

Более сложный, субъективный параметр. Сюда можно отнести приятность экспозиции (нет «плоского» переосвещённого неба, проработаны тени), наличие динамического диапазона (видны детали и в светлых, и в тёмных участках), композиция кадра и эффект присутствия. Часто обеспечивается правильной настройкой камеры (RAW-файлы для максимального динамического диапазона, оптимальная диафрагма для резкости по полю кадра и т.д.), частично – обработкой (кривые, виньетирование, которое фокусирует внимание на центре). Метрик как таковых нет, но итоговый ролик будет оцениваться экспертно: соответствует ли он критериям «кинематографичности» (можно сравнить с эталонными примерами лучших таймлапсов).

Помимо перечисленного, в отчёте будут упоминаться технические параметры итогового видео: разрешение (например, 3840x2160 4K), соотношение сторон (16:9 как стандарт), частота кадров (24 fps – стандарт кино, либо 30 fps, в зависимости от решения), длительность видео и размер выходного файла. Эти параметры сами по себе не метрики качества, но важные характеристики, влияющие на восприятие (например, 24 fps зачастую предпочтительнее для киношного вида).

Все вышеописанные метрики будут использованы при планировании экспериментов. Например, при тестировании разных выдержек мы будем смотреть на плавность движения и мерцание; при выборе ISO – на уровень шума и динамический диапазон; при настройке ffmpeg – на SSIM/битрейт и отсутствие артефактов. Цель – оптимизировать все параметры так, чтобы видео удовлетворяло субъективным критериям «красиво и плавно» и не имело очевидных технических изъянов.
