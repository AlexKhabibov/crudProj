export function fileToBase64(
    file: File
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;

            if (typeof result !== "string") {
                reject(
                    new Error(
                        "Не удалось прочитать файл"
                    )
                );
                return;
            }

            const base64 = result.split(",")[1];

            if (!base64) {
                reject(
                    new Error(
                        "Не удалось получить Base64"
                    )
                );
                return;
            }

            resolve(base64);
        };

        reader.onerror = () => {
            reject(
                new Error("Ошибка чтения файла")
            );
        };

        reader.readAsDataURL(file);
    });
}