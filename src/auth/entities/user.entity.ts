import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @ApiProperty({
        description: 'User ID of type uuid',
        example: '83a2269b-b135-4128-b18d-e8bdc3d7be34',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
    })
    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @ApiProperty({
        description: ''
    })
    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @ApiProperty({
        description: ''
    })
    @Column({
        type: 'text'
    })
    fullName: string;

    @ApiProperty({
        description: ''
    })
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        description: ''
    })
    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @ApiProperty({
        example: '83a2269b-b135-4128-b18d-e8bdc3d7be34',
        description: 'Product user',
    })
    @OneToMany(
        () =>  Product,
        (product) => product.user
    )
    product: Product

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    ckeckFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert()
    }


}
