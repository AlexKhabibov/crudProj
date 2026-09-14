import type { Skill } from "@/entities/skill/model/types";
import type { Specialization } from "@/entities/specialization/model/types";

interface SpecializationsTableProps {
    specializations: Specialization[];
    skills: Skill[];
}

export function SpecializationsTable({
    specializations,
    skills,
}: SpecializationsTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Выбор</th>
                    <th>Изображение</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Навыки</th>
                    <th>Опции</th>
                </tr>
            </thead>

            <tbody>
                {specializations.map((specialization) => {
                    const specializationSkills = skills.filter((skill) =>
                        skill.specializations.some(
                            (skillSpecialization) =>
                                skillSpecialization.id === specialization.id
                        )
                    );

                    return (
                        <tr key={specialization.id}>
                            <td>checkbox</td>
                            <td>{specialization.imageSrc}</td>
                            <td>{specialization.title}</td>
                            <td>{specialization.description}</td>
                            <td>
                                {specializationSkills.map((skill) => (
                                    <div key={skill.id}>
                                        {skill.title}
                                    </div>
                                ))}
                            </td>
                            <td>options</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}