import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Unique(['content_id'])
@Entity()
export class Contents{
    @PrimaryGeneratedColumn()
    content_id:number;

    @Column("varchar", {length:255, nullable:true})
    content_name:string;

    @Column("varchar", {length:255, nullable:true})
    content_path:string;

    @Column("varchar", {length:255, nullable:true})
    content_category:string;

    @CreateDateColumn()
    content_create_at:Date;
}