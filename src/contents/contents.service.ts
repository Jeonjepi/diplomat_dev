import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Contents } from './entities/contents.entity';
const fs = require('fs')

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Contents)
    private contentRepository: Repository<Contents>,
  ){}

  
  async getfiles(queryString){
    console.log("qe", queryString)
    const { category, offset, limit, order } = queryString

    const findCategory = await this.contentRepository.findOne({where:{content_category:Equal(category)}})
    if(findCategory){
      throw new NotFoundException({
        message : 'category not found'
      })
    }

    const findFile = await this.contentRepository.createQueryBuilder('contents')
    .select([
      'contents.content_id as content_id',
      'contents.content_name as content_name',
      'contents.content_path as content_path',
      'contents.content_category as content_category',
      'contents.content_create_at as content_create_at',
    ])

    if(category) findFile.where('contents.content_category =:category', {category :category})
    if(order == '+create_at'){
      findFile.orderBy('contents.content_create_at', 'ASC')
    }else if(order == '-create_at'){
      findFile.orderBy('contents.content_create_at', 'DESC')
    }
    if (limit) findFile.limit(limit).offset(offset)

    const result = await findFile.getRawMany()
    return result;
  }

  async uploadFiles(reqBody, file){

    const content = JSON.parse(JSON.stringify(file))

    const tmp = Object.values(content)

    console.log('file', reqBody)
    const {name, category} = reqBody

    const sameName = await this.contentRepository.findOne({where:{content_name:Equal(name)}})
    if(sameName){
      throw new BadRequestException({
        message : 'file name already taken'
      })
    }
    const createContent = this.contentRepository.create({
      content_name:name,
      content_category:category,
      content_path:tmp[0][0]?.path,
    })
    await this.contentRepository.save(createContent)

  }

  async deleteFile(param){
    const deleteId = param['file_id']
    console.log("123", deleteId)
    const findFile = await this.contentRepository.findOne({where:{content_id:Equal(deleteId)}})
    if(!findFile){
      throw new NotFoundException({
        message:'file not found'
      })
    }

    fs.unlink(findFile?.content_path, (err) => {
      console.log(err)
    })
    await this.contentRepository.delete({content_id:Equal(deleteId)})
  }
}
