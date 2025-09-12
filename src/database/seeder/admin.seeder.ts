import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/common/enums/auth-roles.enum';

export async function AdminSeeder(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const existing = await userRepository.findOne({ where: { email: 'admin@dinedesk.com' } });

    if (!existing) {
        const hashedPassword = await bcrypt.hash('demodemo123', 10);

        await userRepository.save(
            userRepository.create({
                name: 'Dummy Admin',
                email: 'admin@dinedesk.com',
                password: hashedPassword,
                role: UserRole.ADMIN,
                isVerified: true
            }),
        );

        console.log('Admin user seeded');
    } else {
        console.log('Admin user already exists');
    }
}
