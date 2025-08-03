import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/entity/user.entity';

export async function AdminSeeder(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const existing = await userRepository.findOne({ where: { email: 'demo@gmail.com' } });

    if (!existing) {
        const hashedPassword = await bcrypt.hash('demodemo123', 10);

        await userRepository.save(
            userRepository.create({
                name: 'Super Admin',
                email: 'demo@gmail.com',
                password: hashedPassword,
                role: UserRole.SUPERADMIN,
            }),
        );

        console.log('Admin user seeded');
    } else {
        console.log('Admin user already exists');
    }
}
